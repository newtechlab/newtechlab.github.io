function convert2HTML(markdown) {
  var converter = new showdown.Converter();
  return converter.makeHtml(markdown);
}

function createArticle(parent, article, back) {
  var navBar = document.createElement('div');
  navBar.setAttribute('id', 'navBar');
  parent.appendChild(navBar);

  var backButton = document.createElement('img');
  backButton.setAttribute('id', 'backButton');
  backButton.setAttribute('src', './static/back2.png');
  navBar.appendChild(backButton);

  var logo = document.createElement('img');
  logo.setAttribute('id', 'logo');
  logo.setAttribute('src', './static/ntl.png');
  navBar.appendChild(logo);
  backButton.onclick = function() {
    back();
  };

  var editButton = document.createElement('img');
  editButton.setAttribute('id', 'editButton');
  editButton.setAttribute('src', './static/edit.png');
  navBar.appendChild(editButton);

  var ww = document.createElement('div');
  ww.className = 'topwrapper';
  parent.appendChild(ww);

  var articleImg = document.createElement('img');
  articleImg.setAttribute('id', 'articleImg');
  articleImg.setAttribute('src', './static/texture4.jpg');
  ww.appendChild(articleImg);

  var titleWrapper = document.createElement('div');
  titleWrapper.setAttribute('id', 'titleWrapper');
  ww.appendChild(titleWrapper);

  var articleTitle = document.createElement('h1');
  articleTitle.setAttribute('id', 'articleTitle');
  articleTitle.setAttribute('class', 'title');
  articleTitle.innerHTML = article.name;
  titleWrapper.appendChild(articleTitle);

  var publishedData = document.createElement('h5');
  var date = new Date(article.lastUpdated);
  publishedData.setAttribute('id', 'publishedDate');
  publishedData.setAttribute('class', 'title');
  publishedData.innerHTML =
    'published ' +
    (date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear());
  titleWrapper.appendChild(publishedData);

  var articleContent = document.createElement('div');
  articleContent.setAttribute('id', 'articleContent');
  articleContent.innerHTML = convert2HTML(article.markdown);
  parent.appendChild(articleContent);
}
