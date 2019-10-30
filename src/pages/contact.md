---
layout: layouts/contact.njk
title: Contact
tags:
  - nav
navtitle: Contact
section: contact
date: Last Modified
permalink: /contact/index.html
---

If you have any questions or just want to say “hi”, you can reach me using the form below.

You can also find me at:

Phone: {{settings.phone}}
Email: {{settings.email}}
email: {{settings.email}}
Social:
{% for social in settings.socials %}
  <a href="{{social.url}}" class="fab fa-{{social.name}}">
{% endfor %}


- [Twitter](https://twitter.com/brxdlxy) - twitter.com/brxdlxy
- [Instagram](https://www.instagram.com/brxdlxy/) - instagram.com/brxdlxy
- [500px](https://500px.com/brxdlxy) - 500px.com/brxdlxy
- [Flickr](https://www.flickr.com/photos/sypsyn/) - flickr.com/photos/sypsyn
- [Github](https://github.com/brxdlxy) - github.com/brxdlxy
