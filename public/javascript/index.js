function init(){
  let urlInput = document.getElementById("urlInput");
  urlInput.onkeyup = previewUrl;
  urlInput.onchange = previewUrl;
  urlInput.onclick = previewUrl;
  loadPosts();
}

async function loadPosts(){
  document.getElementById("posts_box").innerText = "Loading...";
  let postsJson = await fetchJSON(`api/${apiVersion}/posts`)
  
  let postsHtml = postsJson.map(postInfo => {
      return `<div class="post">${postInfo.description}${postInfo.htmlPreview}</div>`
  }).join("\n");
  document.getElementById("posts_box").innerHTML = postsHtml;
}

async function postUrl(){
  document.getElementById("postStatus").innerHTML = "sending data..."
  let url = document.getElementById("urlInput").value;
  let description = document.getElementById("descriptionInput").value;

  try{
      await fetchJSON(`api/${apiVersion}/posts`, {
          method: "POST",
          body: {url: url, description: description}
      })
  }catch(error){
      document.getElementById("postStatus").innerText = "Error"
      throw(error)
  }
  document.getElementById("urlInput").value = "";
  document.getElementById("descriptionInput").value = "";
  document.getElementById("url_previews").innerHTML = "";
  document.getElementById("postStatus").innerHTML = "successfully uploaded"
  loadPosts();
}


let lastTypedUrl = ""
let lastTypedTime = Date.now();
let lastURLPreviewed = "";
async function previewUrl(){
  document.getElementById("postStatus").innerHTML = "";
  let url = document.getElementById("urlInput").value;

  if(url != lastTypedUrl){
      
      lastTypedUrl = url;
      let timeSinceLastType = Date.now() - lastTypedTime
      lastTypedTime = Date.now()
      if(timeSinceLastType < 500){ 
          await new Promise(r => setTimeout(r, 1000))
      }
      if(url != lastTypedUrl){
          return;
      }
      
      if(url != lastURLPreviewed) { 
          lastURLPreviewed = url; 
          document.getElementById("url_previews").innerHTML = "Loading preview..."
          try{
              let response = await fetch(`api/${apiVersion}/urls/preview?url=` + url)
              let previewHtml = await response.text()
              if(url == lastURLPreviewed){
                  document.getElementById("url_previews").innerHTML = previewHtml;
              }
          }catch(error){
              document.getElementById("url_previews").innerHTML = "There was an error: " + error;
          }
      }
  }
}

