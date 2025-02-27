document.addEventListener("DOMContentLoaded", function () {
    generateBlog();
});

function generateBlog() {
  //  fetch("assets/blog/blog.json")
    fetch("https://script.google.com/macros/s/AKfycbwMvKTXGI13clEGeAw5nA-x0QocCe2OzJvdcVJwHoFTg6Yp92dV9O2jhRCZBMX7nJeI/exec")
        .then(response => response.json())
        .then(data => {
            const blogContainer = document.getElementById("blog-container");
            blogContainer.innerHTML = "";

            data.forEach((blog) => {
                const categoryDisplay = `${blog.category} / ${blog.Subcategory}`;

                // Create the blog post structure
                const blogHTML = `
                    <div class="col-sm-6">
                        <div class="single_blog_area textwhite">
                            <div class="row">
                                <div class="col-sm-4 no-padding">
                                    <div class="single_blog_img">
                                        <img src="${blog.image}" alt="${blog.title}" />
                                    </div>
                                </div>
                                <div class="col-sm-8 no-padding">
                                    <div class="single_blog_text s_b_left">
                                        <p>${categoryDisplay}</p>
                                        <h2>${blog.title}</h2>
                                        <div class="separator2"></div>
                                        <p class="blog-summary">${blog.summary}</p>
                                        
                                        <a href="javascript:void(0);" class="read_more" data-target="${blog.id}" data-content="${blog.contentFile}">Read More >></a>
                                        
                                        <div class="expanded-blog-content" id="${blog.id}" style="display: none;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

                blogContainer.innerHTML += blogHTML;
            });

            // Attach event listeners for loading content dynamically
            attachEventListeners();
        })
        .catch(error => console.error("Error loading blog data:", error));
}

function attachEventListeners() {
    const readMoreButtons = document.querySelectorAll(".read_more");

    readMoreButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const contentFile = this.getAttribute("data-content");
            const contentDiv = document.getElementById(targetId);

            if (contentDiv.style.display === "block") {
                contentDiv.style.display = "none";
                this.textContent = "Read More >>";
            } else {
                // Fetch content from the separate file and insert into the div
                fetch(contentFile)
                    .then(response => response.text())
                    .then(html => {
                        contentDiv.innerHTML = html;
                        contentDiv.style.display = "block";
                        this.textContent = "Read Less <<";

                        // Attach close button functionality
                        attachCloseButtons(contentDiv);
                    })
                    .catch(error => console.error("Error loading blog content:", error));
            }
        });
    });
}

function attachCloseButtons(contentDiv) {
    const closeButton = contentDiv.querySelector(".close-content-btn");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            contentDiv.style.display = "none";
        });
    }
}