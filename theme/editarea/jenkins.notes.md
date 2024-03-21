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

Jenkins v2 todo...

SSH:
```html
<textarea name="_.execCommand" class="setting-input validated ssh-exec-control" checkurl=".../descriptorByName/jenkins.plugins.publish_over_ssh.BapSshTransfer/checkExecCommand" rows="9">
```

Groovy: 
```html
<textarea name="_.script" rows="5" class="jenkins-input validated  " checkurl=".../descriptorByName/org.jenkinsci.plugins.scriptsecurity.sandbox.groovy.SecureGroovyScript/checkScript"></textarea>
```

Windows:
```html
<textarea name="command" class="setting-input   fixed-width" rows="5"></textarea>
```
