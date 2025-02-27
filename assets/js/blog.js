document.addEventListener("DOMContentLoaded", function () {
    generateBlog();
});
function generateBlog() {
    // Published Google Sheet as CSV
    const SHEET_ID = '1hmRibcBrnn8LUo5wXZ9Y4m4oT3e76pn9bRFnSSZ_UXE';
    const SHEET_NAME = 'blog'; // Your sheet tab name
    const PUBLISHED_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

    fetch(PUBLISHED_URL)
        .then(response => response.text())
        .then(csvText => {
            // Parse CSV into JSON
            const data = parseCSV(csvText);
            
            // Continue with your existing rendering code...
            const blogContainer = document.getElementById("blog-container");
            blogContainer.innerHTML = "";
            
            data.forEach((blog) => {
                // Your existing rendering code...
            });
            
            attachEventListeners();
        })
        .catch(error => console.error("Error loading blog data:", error));
}

// Simple CSV parser function
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => 
        header.replace(/"/g, '').trim().toLowerCase()
    );
    
    return lines.slice(1).map(line => {
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const row = {};
        
        headers.forEach((header, i) => {
            const value = values[i] ? values[i].replace(/"/g, '') : '';
            row[header] = value;
        });
        
        return row;
    });
}

/*
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
*/
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
