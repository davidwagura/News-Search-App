// index.js

// ✅ Use your actual API key from https://gnews.io
const apiKey = "a5133228fca4e620ba73f22867cede8a"; // Replace "demo" with your real key

document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const searchField = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    async function fetchNews(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.error("Error fetching news", error);
            return [];
        }
    }

    function displayArticles(articles) {
        blogContainer.innerHTML = "";

        if (!articles.length) {
            blogContainer.innerHTML = "<p>No news articles found.</p>";
            return;
        }

        articles.forEach((article) => {
            const card = document.createElement("div");
            card.classList.add("blog-card");

            const image = document.createElement("img");
            image.src = article.image || "https://via.placeholder.com/600x400";
            image.alt = article.title;

            const title = document.createElement("h2");
            title.textContent = article.title.length > 30
                ? article.title.slice(0, 30) + "..."
                : article.title;

            const desc = document.createElement("p");
            desc.textContent = article.description?.length > 120
                ? article.description.slice(0, 120) + "..."
                : article.description || "No description available.";

            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(desc);

            card.addEventListener("click", () => {
                window.open(article.url, "_blank");
            });

            blogContainer.appendChild(card);
        });
    }

    async function loadTopHeadlines() {
        const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=10&token=${apiKey}`;
        const articles = await fetchNews(url);
        displayArticles(articles);
    }

    async function searchNews(query) {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&token=${apiKey}`;
        const articles = await fetchNews(url);
        displayArticles(articles);
    }

    searchButton.addEventListener("click", () => {
        const query = searchField.value.trim();
        if (query) {
            searchNews(query);
        }
    });

    // Load headlines on page load
    loadTopHeadlines();
});
