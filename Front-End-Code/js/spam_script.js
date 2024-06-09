$(document).ready(function() {
    $('#userInput').on('input', function() {
        var userInput = $(this).val();
        if (!userInput.trim()) {
            $('#spamWordsLive').empty();
            return;
        }

        $.ajax({
            url: 'https://proxy.alejandrobermea.com/live_spam_words',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                text: userInput
            }),
            success: function(response) {
                if (response.common_spam_words && response.common_spam_words.length > 0) {
                    var sortedSpamWords = response.common_spam_words.sort(function(a, b) {
                        return b[1] - a[1];
                    });

                    var wordsList = '';
                    var totalScore = 0;
                    sortedSpamWords.forEach(function(item, index) {
                        wordsList += (index + 1) + '- ' + item[0] + '<br>';
                        totalScore += item[1];
                    });

                    $('#spamWordsLive').html('<div style="text-align:center; font-weight:bold;">Total Spam Score: ' + totalScore.toFixed(3) + '</div>' + wordsList);
                } else {
                    $('#spamWordsLive').html('<p>No spam trigger words detected currently.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching live spam words:', xhr.responseText);
                $('#spamWordsLive').html('<p>Error fetching live spam words.</p>');
            }
        });
    });

    $('#analyzeButton').click(function(event) {
        event.preventDefault();
        var userInput = $('#userInput').val();
        if (!userInput.trim()) {
            alert('Please enter text to analyze.');
            return;
        }

        $.ajax({
            url: 'https://proxy.alejandrobermea.com/spam_detector',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                text: userInput
            }),
            success: function(response) {
                var resultMessage = 'Result: ' + response.result;
                alert(resultMessage);
            },
            error: function(xhr, status, error) {
                alert('Error: ' + xhr.responseText);
            }
        });
    });
});
document.addEventListener('mousemove', function(e) {
    var gradientBar = document.querySelector('.static_gradient-bar');
    var width = window.innerWidth;
    var mouseX = e.clientX;
    var percentage = mouseX / width * 100;
    gradientBar.style.background = 'linear-gradient(to right, black 0%, black ' + (percentage - 20) + '%, #202a2d ' + percentage + '%, black ' + (percentage + 20) + '%, black 100%)';
});
