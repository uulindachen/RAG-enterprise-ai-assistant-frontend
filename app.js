$(function () {
    function scrollToBottom() {
        $("html, body").animate(
            { scrollTop: $(document).height() },
            300
        );
    }

    function escapeHtml(text) {
        return $("<div>").text(text).html();
    }

    function buildRecordsHtml(records) {
        if (!records || records.length === 0) {
            return "";
        }

        return `
            <div class="record-section">
                <div class="record-title">Retrieval Records</div>
                <div class="record-table">
                    ${records.map(record => `
                        <div class="record-row">
                            <div class="record-cell label">Chunk ID</div>
                            <div class="record-cell value mono">${escapeHtml(record.chunk_id || "")}</div>
                            <div class="record-cell label">Distance</div>
                            <div class="record-cell value">${record.distance ?? ""}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function buildBotMessage(message, records) {
        return `
            <div class="message-row bot">
                <div class="message bot-message">
                    <div class="bot-header">
                        <div class="bot-title">Summary Answer</div>
                        <div class="bot-tag">Found ${records.length} records</div>
                    </div>
                    <div class="bot-content">
                        ${escapeHtml(message || "No answer returned.")}
                    </div>
                    ${buildRecordsHtml(records)}
                </div>
            </div>
        `;
    }

    function buildErrorMessage(text) {
        return `
            <div class="message-row bot">
                <div class="message bot-message">
                    <div class="bot-header">
                        <div class="bot-title">Error</div>
                        <div class="bot-tag">Request Failed</div>
                    </div>
                    <div class="bot-content">
                        ${escapeHtml(text)}
                    </div>
                </div>
            </div>
        `;
    }

    function buildLoadingMessage(loadingId) {
        return `
            <div class="message-row bot" id="${loadingId}">
                <div class="message bot-message">
                    <div class="bot-header">
                        <div class="bot-title">Summary Answer</div>
                        <div class="bot-tag">Searching...</div>
                    </div>
                    <div class="bot-content">
                        <div class="loading-wrap">
                            <div class="loading-text">Loading</div>
                            <div class="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    $("#sendBtn").on("click", function () {
        const value = $("#questionInput").val().trim();

        if (!value) {
            alert("Please enter a question.");
            return;
        }

        const $btn = $("#sendBtn");
        const $input = $("#questionInput");

        const userHtml = `
            <div class="message-row user">
                <div class="message user-message">${escapeHtml(value)}</div>
            </div>
        `;

        $(".chat-shell").append(userHtml);

        const loadingId = "loading-" + Date.now();
        $(".chat-shell").append(buildLoadingMessage(loadingId));

        $input.val("");
        $input.prop("disabled", true);
        $btn.prop("disabled", true);

        scrollToBottom();

        setTimeout(()=>{
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/todos/1",
            method: "GET",
            data: {
                query: value
            },
            success: function (res) {
                const fakeRes = {
                    "message": "Linda is the best software developer I've ever met.",
                    "records": [
                        {
                            chunk_id: "chunk_12",
                            distance: 0.858
                        },
                        {
                            chunk_id: "chunk_13",
                            distance:  0.912
                        }
                    ]
                }

                res = fakeRes;

                const records = res.records || [];

                $("#" + loadingId).replaceWith(
                    buildBotMessage(res.message, records)
                );

                scrollToBottom();
            },
            error: function (xhr) {
                let errorMessage = "Something went wrong.";

                if (xhr.status === 404) {
                    errorMessage = "No result found.";
                } else if (xhr.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                }

                $("#" + loadingId).replaceWith(
                    buildErrorMessage(errorMessage)
                );

                scrollToBottom();
            },
            complete: function () {
                $input.prop("disabled", false);
                $btn.prop("disabled", false);
                $input.focus();
            }
            });
        }, 5000)
    });

    $("#questionInput").on("keypress", function (e) {
        if (e.which === 13) {
            $("#sendBtn").click();
        }
    });
});