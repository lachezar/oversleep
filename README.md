![travis](https://travis-ci.org/lucho-yankov/overtime.svg?branch=master)

oversleep
=========

Oversleep is a web app that helps you track how long does it take you to leave your bed after your alarm sets off.

Install bourbon:

```
gem install sass #or gem update sass
gem install bourbon #or gem update bourbon
gem install neat
gem install bitters
bourbon install #If not installed
neat install
bitters install
```

Make sure the following lines in "_bitters.scss" are uncommented:

```
@import "neat-helpers"; // or "neat/neat-helpers" when not in Rails
@import "grid-settings";
```

TODO
====

* Layout/templating mechanism that will allow html code re-use (especially the common parts as js, tabs, etc.)
* Check for spelling mistakes.
* Optimize images
* Make the Save dialog less ugly
