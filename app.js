$(function () {
    $("#sendBtn").on("click", function () {
        const value = $("#questionInput").val().trim();

        if (!value) {
            alert("Please enter a question.");
            return;
        }

        const userHtml = `
                    <div class="message-row user">
                        <div class="message user-message"></div>
                    </div>
                `;

        $(".chat-shell").append(userHtml);
        $(".chat-shell .message-row.user:last .user-message").text(value);

        $("#questionInput").val("");

        $("html, body").animate(
            { scrollTop: $(document).height() },
            300
        );
    });

    $("#questionInput").on("keypress", function (e) {
        if (e.which === 13) {
            $("#sendBtn").click();
        }
    });
});