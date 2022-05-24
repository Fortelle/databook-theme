# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "databook-theme"
  spec.version       = File.read("_includes/version").strip
  spec.authors       = ["Fortelle"]
  spec.email         = ["fortelle@outlook.com"]

  spec.summary       = "A Jekyll theme for personal sites, blogs, and documentations."
  spec.homepage      = "https://fortelle.github.com/databook-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", "~> 3.9"
  spec.add_runtime_dependency "kramdown-parser-gfm", "~> 1.1.0"
  spec.add_runtime_dependency "webrick", "~> 1.7.0"
  spec.add_development_dependency "bundler", "~> 2.2.33"
  spec.add_development_dependency "rake", "~> 12.0"
end
