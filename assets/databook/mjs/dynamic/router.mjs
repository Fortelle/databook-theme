const hashpattern = /^#(?:!{0,1}\/{0,1}(?<path>.*?)\/*){0,1}(?:\?(?<search>.+){0,1}){0,1}$/;
const hash_prefix = '#!/';

let isListening = false;
let currentLocation;

class RouteLocation {
  //path;
  page;
  search;
  searchParams;
  query;
  root;

  constructor(data) {
    let hash;
    if (data instanceof Location) {
      hash = data.hash;
      root = data.pathname;
    } else if (typeof data === 'string' && data.startsWith('#')) {
      hash = data;
    }

    const match = data.match(hashpattern);
    if (match) {
      //this.path = match.groups.path;
      this.page = match.groups.path;
      this.search = match.groups.search;
      this.searchParams = new URLSearchParams(match.groups.search);
      if (this.searchParams.size > 0) {
        const query = {};
        for (const [key, value] of this.searchParams.entries()) {
          if (key.endsWith('[]')) {
            const realKey = key.replaceAll('[]', '');
            if (Object.hasOwn(query, realKey)) {
              query[realKey].push(value);
            } else {
              query[realKey] = [value];
            }
          } else {
            if (Object.hasOwn(query, key)) {
              if (Array.isArray(query[key])) {
                query[key].push(value);
              } else {
                query[key] = [query[key], value];
              }
            } else {
              query[key] = value;
            }
          }
        }
        this.query = query;
      }
    }
  }

}

class HashChangeEvent extends Event {
  location;
  isHistory = false;
  isPageChanged = false;

  constructor(location) {
    super("hashchange");

    this.location = location;
  }

}

const launch = async function (callback) {
  currentLocation = new RouteLocation(window.location.hash);
  await callback({
    location: currentLocation,
    isEvent: false,
    isHistory: false,
    isPageChanged: true,
  });

  if (!isListening) {

    window.addEventListener('hashchange', () => {
      window.history.replaceState({}, '');
    });

    window.addEventListener("popstate", (event) => {
      const oldLocation = currentLocation;
      currentLocation = new RouteLocation(window.location.hash);
      const hashChangeEvent = new HashChangeEvent(currentLocation);
      hashChangeEvent.isHistory = !!(event?.state);
      hashChangeEvent.isPageChanged = currentLocation.page !== oldLocation?.page;
      databook.event.dispatchEvent(hashChangeEvent);
    });

    isListening = true;
  }

  databook.event.addEventListener('hashchange', (event) => {
    callback({
      location: event.location,
      isEvent: true,
      isHistory: event.isHistory,
      isPageChanged: event.isPageChanged,
    });
  });
};

/**
  * @param {Object} options
  * @param {string} options.page
  * @param {string} options.base
  * @param {string} options.mode
  * @param {string|URLSearchParams|Object} options.query
  */
const goto = function (options) {
  const hashString = getHash(options);

  if (options.page) {
    const href = options.page.replace(/\/+$/, '') + hashString;
    window.location.href = href;
  } else {
    switch (options.mode ?? 'hash') {
      case 'hash': {
        window.location.hash = hashString;
        break;
      }
      case 'history': {
        window.history.pushState({}, null, hashString);
        const location = new RouteLocation(hashString);
        const hashChangeEvent = new HashChangeEvent(location);
        hashChangeEvent.isChanged = true;
        databook.event.dispatchEvent(hashChangeEvent);
        break;
      }
      case 'shadow': {
        const location = new RouteLocation(hashString);
        const hashChangeEvent = new HashChangeEvent(location);
        hashChangeEvent.isChanged = true;
        databook.event.dispatchEvent(hashChangeEvent);
        break;
      }
    }
  }
};

/**
  * @param {Object} options
  * @param {string} options.path
  * @param {string|URLSearchParams|Object} options.query
  */
const getHash = function (options) {
  const page = options.page ?? currentLocation.page;
  let hashString = hash_prefix + page;
  if (options.query) {
    const params = new URLSearchParams();
    let keyvaluepairs;

    if (typeof options.query === 'string') {
      keyvaluepairs = [...new URLSearchParams(options.query)];
    }
    else if (options.query instanceof URLSearchParams) {
      keyvaluepairs = [...options.query];
    }
    else if (Array.isArray(options.query)) {
      keyvaluepairs = options.query;
    }
    else {
      keyvaluepairs = Object.entries(options.query);
    }

    for (const [key, value] of keyvaluepairs) {
      if (value === undefined || value === null || value === "") {
        continue;
      } else if (value === false) {
        //params.append(key, 0);
      } else if (value === true) {
        params.append(key, 'on');
      } else if (Array.isArray(value)) {
        const childKey = key.endsWith('[]') ? key : key + '[]';
        for (const childValue of value) {
          params.append(childKey, childValue);
        }
      } else {
        params.append(key, value);
      }
    }

    params.sort();
    hashString += `?${params}`;
  }

  return hashString;
};

export default {
  launch,
  goto,
};
