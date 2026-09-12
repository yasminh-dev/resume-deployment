---
layout: default
title: resume
--- 
<link rel="stylesheet" type="text/css" href="./assets/css/resume.css" />

{% assign r = site.data.resume %}
# {{ r.contact.name }}
## {{ r.contact.title }} <br>{{ r.contact.location }}
* {{ r.contact.email }}
* [{{ r.contact.linkedin_label }}]({{ r.contact.linkedin_url }})

*[See the interactive kaiju-themed version of this resume →](interactive/)*

## Summary
{{ r.summary }}

## Technical Skills
{% for skill in r.skills %}* {{ skill }}
{% endfor %}
## Work Experience
{% for job in r.experience %}### {{ job.company }}<br>{{ job.location }}
**{{ job.title }}**<br>
*{{ job.dates }}*
{% for bullet in job.bullets %}* {{ bullet }}
{% endfor %}
{% endfor %}
## Additional Experience
{% for item in r.additional %}* {{ item }}
{% endfor %}
## Education
### {{ r.education.school }}<br>{{ r.education.location }}
**{{ r.education.status }}**<br>
*{{ r.education.dates }}*
{% for detail in r.education.details %}* {{ detail }}
{% endfor %}
