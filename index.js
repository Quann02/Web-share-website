async function previewUrl() {
  try {
    const urlInput = document.getElementById('urlInput').value;
    console.log('URL input:', urlInput);

    const urlRequest = await fetch(`/api/v1/urls/preview?url=${urlInput}`);
    console.log('Fetch response:', urlRequest);

    const responseHTML = await urlRequest.text();
    console.log('Response HTML:', responseHTML);

    docsument.getElementById('url_previews').innerHTML = responseHTML;

  } catch (error) {
    console.error('Error previewing URL:', error);
    
  }
}