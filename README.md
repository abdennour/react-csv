[![Build Status](https://travis-ci.org/abdennour/react-csv.svg?branch=master)](https://travis-ci.org/abdennour/react-csv)
[![Coverage Status](https://coveralls.io/repos/github/abdennour/react-csv/badge.svg?branch=master)](https://coveralls.io/github/abdennour/react-csv?branch=master)

![](https://raw.githubusercontent.com/rathath/bucket/master/img/react-csv.png)

[![Build Status](https://travis-ci.org/abdennour/react-csv.svg?branch=master)](https://travis-ci.org/abdennour/react-csv)
[![Coverage Status](https://coveralls.io/repos/github/abdennour/react-csv/badge.svg?branch=master)](https://coveralls.io/github/abdennour/react-csv?branch=master)

# Overview :

Generate a CSV file from given data.

This data can be an array of arrays, an array of literal objects, or strings.

# Example :

```js
import { CSVLink, CSVDownload } from "react-csv";

const csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"]
];
<CSVLink data={csvData}>Download me</CSVLink>;
// or
<CSVDownload data={csvData} target="_blank" />;
```

For more examples, see [here 👈🏼](http://react-csv.github.io/react-csv/)

# Install

```
npm install react-csv --save;
```

Or for non-node developers, you can use CDN directly:

```html
<script src="https://cdn.rawgit.com/abdennour/react-csv/6424b500/cdn/react-csv-latest.min.js" type="text/javascript"></script>
```

# Components:

This package includes two components: `CSVLink` and `CSVDownload`.

## 0. Common Props:

The two components accept the following `Props`:

### - **data** Props:

A required property that represents the CSV data.
This data can be _array of arrays_, _array of literal objects_ or _string_.

**Example of Array of arrays**

```js
// Array of arrays. Each item is rendered as a CSV line
data = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"]
];
```

**Example of array of literal objects**

```js
// Array of literal objects. Each item is rendered as CSV line however the order of fields will be defined by the headers props. If the headers props are not defined, the component will generate headers from each data item.
data = [
  { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
];
```

**Example of strings**

```js
// A string can be used if the data is already formatted correctly

data = `firstname,lastname
Ahmed,Tomi
Raed,Labes
Yezzi,Min l3b
`;

// or using 3rd party package
import json2csv from "json2csv";
data = json2csv(arrayOfLiteralObjects);
```

### - **headers** Props:

Specifying `headers` helps to define an order of the CSV fields. The csv content will be generated accordingly.

> Notes :
>
> - The meaning of headers with data of type `Array` is to order fields AND prepend those headers at the top of the CSV content.
> - The meaning of headers with data of type `String` data is only prepending those headers as the first line of the CSV content.

##### Custom Header Labels

Custom header labels can be used when converting data of type `Object` to CSV by having the header array itself be an array of literal objects of the form:

```js
{ label: /* Label to display at the top of the CSV */, key: /* Key to the data */ }
```

If the header array is an array of strings, the header labels will be the same as the keys used to index the data objects.

Example:

```js
import { CSVLink } from "react-csv";

headers = [
  { label: "First Name", key: "firstname" },
  { label: "Last Name", key: "lastname" },
  { label: "Email", key: "email" }
];

data = [
  { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
];

<CSVLink data={data} headers={headers}>
  Download me
</CSVLink>;
```

##### Nested JSON data

It is possible to reference nested strings in your data using dot notation

```js
headers = [
  { label: 'First Name', key: 'details.firstName' },
  { label: 'Last Name', key: 'details.lastName' },
  { label: 'Job', key: 'job' },
];

data = [
  { details: { firstName: 'Ahmed', lastName: 'Tomi' }, job: 'manager'},
  { details: { firstName: 'John', lastName: 'Jones' }, job: 'developer'},
];
```
Note: if at any point the nested keys passed do not exist then looks for key with dot notation in the object.

### - **separator** Props:

Following a request to add [this feature](https://github.com/react-csv/react-csv/issues/3) , from `1.0.1` release, `react-csv` supports `separator` props which is equals by default a comma `,` .

```js
import { CSVLink } from "react-csv";

<CSVLink data={array} separator={";"}>
    Download me
</CSVLink>

/*
    "foo";"bar"
    "a";"b"
 */
```

### - **enclosingCharacter** Props:

Following a request to add [this feature](https://github.com/react-csv/react-csv/issues/68), `react-csv` supports an `enclosingCharacter` prop which defaults to `"`.


```js
import {CSVLink} from 'react-csv';

<CSVLink data={array} enclosingCharacter={`'`}>
    Download me
</CSVLink>

/*
    'foo','bar'
    'a','b'
 */

```

## 1. CSVLink Component:

It renders a hyperlink and clicking on it will trigger the download action of the CSV document.

It does not accept only `data` and `headers` props, but it also renders all props of `HTMLAnchor` tag. (className, target,....)

### - **filename** Props:

`filename` is another props restricted to `CSVLink`. It specifies the filename of the downloaded CSV.

**example**

```js
import { CSVLink } from "react-csv";

<CSVLink
  data={data}
  filename={"my-file.csv"}
  className="btn btn-primary"
  target="_blank"
>
  Download me
</CSVLink>;
```

### - **onClick** Props:

`onClick` is another props restricted to `CSVLink`.

If it is defined, it means 3 things:

1 - It will run at the top of the click handling logic.

2 - [Sync] If it returns an explicit `false`, the return will be interpreted as a claim to stop the click handling, then, the next logic will not be executed if so.

3 - [Async] If it is async, "done" argument must be called if you want to invoke the handling of the component. (check examples below)

4 - [Async] If it is async (includes api call, timeout,... ) and it calls done with `false` will be interpreted as a claim to stop the click handling, then, the next logic will not be executed if so.

**examples**

1. 🔬 Sync + Proceed

```js
import { CSVLink } from "react-csv";

<CSVLink
  data={data}
  onClick={() => {
    console.log("You click the link"); // 👍🏻 Your click handling logic
  }}
>
  Download me
</CSVLink>;
```

2. 🔬 Sync + Don't Proceed

```js
import { CSVLink } from "react-csv";

<CSVLink
  data={data}
  onClick={event => {
    console.log("You click the link");
    return false; // 👍🏻 You are stopping the handling of component
  }}
>
  Download me
</CSVLink>;
```

3. 🔬 Async + Proceed

```js
import { CSVLink } from "react-csv";

<CSVLink
  data={data}
  asyncOnClick={true}
  onClick={(event, done) => {
    axios.post("/spy/user").then(() => {
      done(); // REQUIRED to invoke the logic of component
    });
  }}
>
  Download me
</CSVLink>;
```

4. 🔬 Async + Don't Proceed

```js
import { CSVLink } from "react-csv";

<CSVLink
  data={data}
  asyncOnClick={true}
  onClick={(event, done) => {
    axios.post("/spy/user").then(() => {
      done(false); // Don't Proceed
    });
  }}
>
  Download me
</CSVLink>;
```

## 2. CSVDownload Component:

It triggers downloading ONLY on mounting the component. so , be careful to render this component whenever it is needed.

It does not accept only `data` and `headers` props , but also , it takes advantage of all arguments of `window.open` function known that its signature is :

```js
window.open(ARG0, target, specs, replace);
```

Thus, `target`, `specs` and `replace` Props are available .

**example**

```js
import { CSVDownload } from "react-csv";

<CSVDownload data={data} target="_blank" />;
```

For non-node developers, they have to use CDN version :

```html
 <script src="https://cdn.rawgit.com/abdennour/react-csv/6424b500/cdn/react-csv-latest.min.js" type="text/javascript"></script>

 <script type="text/babel">
   const {CSVDownload, CSVLink} = ReactCSV;// or window.ReactCSV

   const element= (<CSVDownload data={data} target="_blank" />);

   ReactDOM.render(element, document.querySelector('#app'));
 </script>
```

# Contribution :

- Unit-tests must cover at least 90% of code .

- Write documentation of the new class, function, method, attribute ..so on.. following JSDoc syntax.

- Add an example for the new feature to `sample-site`.

- `docker-compose run --rm npm start` runs the [`sample-site`](sample-site/)

- `docker-compose run --rm npm run docgen` generates documentation in HTML output.

- `docker-compose run --rm npm run cdn` generate a bundle to be used as CDN

# Donation

If this project help you reduce time to develop, you can give me a cup of coffee 🍵 :)

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/AbdennourT/2)
