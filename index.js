// index.js

document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const searchField = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    async function fetchNews(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("API route not found. If running locally, please use 'npm run dev' instead of Live Server.");
                }
                throw new Error(`Server error: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server.");
            }
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.error("Error fetching news:", error);
            displayError(error.message);
            return [];
        }
    }

    function displayError(message) {
        blogContainer.innerHTML = `
            <div class="error-container">
                <p class="error-message">⚠️ ${message}</p>
                <p class="error-hint">To run the API locally, make sure you are using <code>npm run dev</code> which supports the Vercel serverless functions.</p>
            </div>
        `;
    }

    function displayArticles(articles) {
        blogContainer.innerHTML = "";

        if (!articles || articles.length === 0) {
            blogContainer.innerHTML = "<p class='no-results'>No news articles found. Please try another search.</p>";
            return;
        }

        articles.forEach((article) => {
            const card = document.createElement("div");
            card.classList.add("blog-card");

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            const image = document.createElement("img");
            image.src = article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600";
            image.alt = article.title;
            imageContainer.appendChild(image);

            const content = document.createElement("div");
            content.classList.add("card-content");

            const title = document.createElement("h2");
            title.textContent = article.title;

            const desc = document.createElement("p");
            desc.textContent = article.description || "No description available.";

            const meta = document.createElement("div");
            meta.classList.add("card-meta");
            const source = document.createElement("span");
            source.textContent = article.source?.name || "News";
            meta.appendChild(source);

            content.appendChild(title);
            content.appendChild(desc);
            content.appendChild(meta);

            card.appendChild(imageContainer);
            card.appendChild(content);

            card.addEventListener("click", () => {
                window.open(article.url, "_blank");
            });

            blogContainer.appendChild(card);
        });
    }

    async function loadTopHeadlines() {
        const articles = await fetchNews('/api/news');
        displayArticles(articles);
    }

    async function searchNews(query) {
        const articles = await fetchNews(`/api/news?q=${encodeURIComponent(query)}`);
        displayArticles(articles);
    }

    searchButton.addEventListener("click", () => {
        const query = searchField.value.trim();
        if (query) {
            searchNews(query);
        }
    });

    searchField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchField.value.trim();
            if (query) searchNews(query);
        }
    });

    // Load headlines on page load
    loadTopHeadlines();
});
