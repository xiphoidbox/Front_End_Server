const dragDropArea = document.getElementById('dragDropArea');
const fileInput = dragDropArea.querySelector('input[type="file"]');
const previewImage = document.getElementById('previewImage');
const resultMessage = document.getElementById('result-message');
const submitButton = document.getElementById('submitButton');
const spinner = document.getElementById('spinner');

dragDropArea.addEventListener('click', () => fileInput.click());
dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('over');
});
dragDropArea.addEventListener('dragleave', () => dragDropArea.classList.remove('over'));
dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('over');
    fileInput.files = e.dataTransfer.files;
    updatePreviewImage();
});
fileInput.addEventListener('change', updatePreviewImage);

function updatePreviewImage() {
    if (fileInput.files && fileInput.files[0]) {
        previewImage.src = URL.createObjectURL(fileInput.files[0]);
        previewImage.style.display = 'block';
    }
}
submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!fileInput.files || !fileInput.files[0]) {
        resultMessage.textContent = 'Please select an image first.';
        resultMessage.classList.add('slide-in');
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    submitButton.style.backgroundColor = 'grey';
    submitButton.textContent = 'Analyzing...';
    submitButton.disabled = true;

    spinner.style.display = 'block';
    resultMessage.textContent = '';
    resultMessage.classList.remove('slide-in');

    fetch('https://proxy.alejandrobermea.com/mask_detection', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            resultMessage.textContent = 'Analysis complete: ' + data.result;
            resultMessage.classList.add('slide-in');
            submitButton.style.backgroundColor = 'black';
            submitButton.textContent = 'Analyze Image';
            submitButton.disabled = false;
        })
        .catch(error => {
            resultMessage.textContent = 'Error: ' + error.message;
            resultMessage.classList.add('slide-in');
            submitButton.style.backgroundColor = 'black';
            submitButton.textContent = 'Analyze Image';
            submitButton.disabled = false;
        })
        .finally(() => {
            spinner.style.display = 'none';
        });
});
document.addEventListener('mousemove', function(e) {
    var gradientBar = document.querySelector('.static_gradient-bar');
    var width = window.innerWidth;
    var mouseX = e.clientX;
    var percentage = mouseX / width * 100;
    gradientBar.style.background = 'linear-gradient(to right, black 0%, black ' + (percentage - 20) + '%, #202a2d ' + percentage + '%, black ' + (percentage + 20) + '%, black 100%)';
});
