## Things to enhance

Note that in Jenkins v2 some elements are enhanced by the CodeMirror. This includes:
- Linux shell.
- Plain Groovy command (not system groovy).

Not supported by Jenkins-CodeMirror:
- Execute NodeJS script
- Execute Windows batch command
- Execute system Groovy script
- Send files or execute commands over SSH

## Structure

```json
[
  {
    "descriptorid": "hudson.plugins.groovy.Groovy",
    "rows": [
      {
        "name": "_.properties",
        "class": "jenkins-input   ",
        "html": "<textarea name=\"_.properties\" rows=\"5\" class=\"jenkins-input   \">"
      }
    ]
  },
  {
    "descriptorid": "jenkins.plugins.nodejs.NodeJSCommandInterpreter",
    "rows": [
      {
        "name": "_.command",
        "class": "jenkins-input   ",
        "html": "<textarea name=\"_.command\" rows=\"5\" class=\"jenkins-input   \">"
      }
    ]
  },
  {
    "descriptorid": "hudson.tasks.BatchFile",
    "rows": [
      {
        "name": "command",
        "class": "jenkins-input   fixed-width",
        "html": "<textarea name=\"command\" rows=\"5\" class=\"jenkins-input   fixed-width\">"
      }
    ]
  },
  {
    "descriptorid": "hudson.plugins.groovy.SystemGroovy",
    "rows": [
      {
        "name": "_.script",
        "class": "jenkins-input validated  ",
        "html": "<textarea checkdependson=\"sandbox oldScript\" name=\"_.script\" checkmethod=\"post\" rows=\"6\" class=\"jenkins-input validated  \" checkurl=\"/job/test-highlighters/descriptorByName/org.jenkinsci.plugins.scriptsecurity.sandbox.groovy.SecureGroovyScript/checkScript\">"
      },
      {
        "name": "_.bindings",
        "class": "jenkins-input   ",
        "html": "<textarea name=\"_.bindings\" rows=\"5\" class=\"jenkins-input   \">"
      }
    ]
  },
  {
    "descriptorid": "jenkins.plugins.publish_over_ssh.BapSshBuilderPlugin",
    "rows": [
      {
        "name": "_.key",
        "class": "jenkins-input   ",
        "html": "<textarea name=\"_.key\" rows=\"5\" class=\"jenkins-input   \">"
      }
    ]
  }
]
```