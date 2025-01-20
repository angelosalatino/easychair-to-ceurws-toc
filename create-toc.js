function createTable() {
  if (checkLoadedScript(scripts_to_load)) {
    console.log("I am creating the table");
    var table = $('.paperTable').tableToJSON({
      ignoreColumns: [0, 2, 3],
      extractor: {
        1: function (cellIndex, $cell) {
          var authors = $cell.find('span').text().replace(' and ', ', ').trim();
          if (authors[authors.length - 1] === ".") {
            authors = authors.slice(0, -1); // removes the final period
          }
          var authors_list = authors.split(",").map(function (item) {
            return item.trim();
          });
          return { 'authors': authors_list, 'title': $cell.find('a').text() };
        },
        4: function (cellIndex, $cell) {
          return $cell.text();
        }
      }
    });

    var table_of_content = '&lt;ul&gt;\n';
    var count = 1;
    for (const [key, value] of Object.entries(table)) {

      if (value['Decision'] == 'ACCEPT') {
        table_of_content += '&lt;li id="paper' + count + '"&gt;&lt;a href="paper' + count + '.pdf"&gt;\n';
        table_of_content += '&lt;span class="CEURTITLE"&gt;' + value['Authors, title']['title'] + '&lt;/span&gt;&lt;/a&gt;\n&lt;span class="CEURPAGES"&gt;XX-YY&lt;/span&gt;\n&lt;br&gt;\n';
        for (var i = 0; i < value['Authors, title']['authors'].length; i++) {
          table_of_content += '&lt;span class="CEURAUTHOR"&gt;' + value['Authors, title']['authors'][i] + '&lt;/span&gt;,\n';
        }
        table_of_content += '&lt;/li&gt;\n\n';
        count++;
      }

    }
    table_of_content += '&lt;ul&gt;\n';

    $('<div id="ceur-toc"></div>').insertBefore('.paperTable');
    wrapper_toc = '<h1>CEUR Table of Contents</h1></br><pre>' + table_of_content + '</pre>'
    $('#ceur-toc').empty(); // just in case it was previously filled
    $('#ceur-toc').append(wrapper_toc);

    // console.log(table_of_content)
    clearInterval(myInterval);
  } else {
    console.log("Looping while I wait everything gets loaded");
  }
}

function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.append(script);
}

function checkLoadedScript(scripts_to_load) {
  var scripts_to_load_set = new Set(scripts_to_load);
  var scripts_loaded_set = new Set();
  var scripts_loaded = document.getElementsByTagName("script");
  for (var i = 0; i < scripts_loaded.length; i++) {
    if (scripts_loaded[i].src)
      scripts_loaded_set.add(scripts_loaded[i].src)
  }
  if (scripts_to_load_set.intersection(scripts_loaded_set).size == scripts_to_load_set.size) {
    return true;
  }
  else {
    return false;
  }
}

const scripts_to_load = ["https://code.jquery.com/jquery-3.7.1.min.js", "https://cdn.jsdelivr.net/npm/table-to-json@1.0.0/lib/jquery.tabletojson.min.js"];
for (var i = 0; i < scripts_to_load.length; i++) {
  loadScript(scripts_to_load[i]);
  console.log("lanched loadscript");
  console.log(checkLoadedScript(scripts_to_load));
}


const myInterval = setInterval(createTable, 2000);
