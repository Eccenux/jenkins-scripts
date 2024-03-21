Structure check:
```js
var inputSelector = 'textarea.jenkins-input:not(.codemirror)';
var sections = [...document.querySelectorAll('.jenkins-form-item [descriptorid]')];
var data = [];
for (section of sections) {
  var descriptorid = section.getAttribute('descriptorid');
  var inputs = [...section.querySelectorAll(inputSelector)];
  if (!inputs.length) {
    continue;
  }
  var dataSection = {descriptorid, rows:[]};
  data.push(dataSection);
  console.log(descriptorid);
	for (input of inputs) {
    var html = input.outerHTML.replace(/(<textarea[^>]*>)[\s\S]+/g, '$1');
    var row = {name:input.name, class:input.className};
    dataSection.rows.push(row);
    console.log(`[${inputs.length}] ` + JSON.stringify(row));
    row.html = html;
  }
}
console.log(data);
copy(data)
```