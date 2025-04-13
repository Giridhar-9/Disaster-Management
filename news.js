
    const API_KEY = '294e2179a5ad45b784574885fab2a5d3';
    const query = '("earthquake" OR "flood" OR "wildfire" OR "tsunami" OR "cyclone")';
    const NEWS_URL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${API_KEY}`;

    let allArticles = [];

    async function fetchDisasterNews() {
      try {
        const res = await fetch(NEWS_URL);
        const data = await res.json();
        allArticles = data.articles || [];
        document.getElementById('loading').style.display = 'none';
        renderNews(allArticles);
      } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('loading').innerText = 'Failed to load news.';
      }
    }

    function renderNews(articles) {
      const container = document.getElementById('news-container');
      container.innerHTML = '';

      if (!articles || articles.length === 0) {
        container.innerHTML = '<p style="color:white;">No news found.</p>';
        return;
      }

      articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';

        const date = new Date(article.publishedAt);
        const formattedDate = date.toLocaleString();

        const lowerText = (article.title + ' ' + article.description).toLowerCase();
        let tagClass = 'default';
        let tagLabel = 'General';

        if (lowerText.includes('earthquake')) {
          tagClass = 'earthquake'; tagLabel = 'Earthquake';
        } else if (lowerText.includes('flood')) {
          tagClass = 'flood'; tagLabel = 'Flood';
        } else if (lowerText.includes('wildfire') || lowerText.includes('wildfire')) {
          tagClass = 'wildfire'; tagLabel = 'Wildfire';
        } else if (lowerText.includes('cyclone')) {
          tagClass = 'cyclone'; tagLabel = 'Cyclone';
        } else if (lowerText.includes('tsunami')) {
          tagClass = 'tsunami'; tagLabel = 'Tsunami';
        } else if(lowerText.includes('drought')) {
          tagClass = 'drought'; tagLabel = 'drought';
        } 

        card.innerHTML = `
          <h2>${article.title}</h2>
          <div class="date-time">${formattedDate}</div>
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank">Read more</a>
          <div class="tag ${tagClass}">${tagLabel}</div>
        `;
        container.appendChild(card);
      });
    }

    document.getElementById('search-input').addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = allArticles.filter(article =>
        (article.title + article.description).toLowerCase().includes(keyword)
      );
      renderNews(filtered);
    });

    window.onload = fetchDisasterNews;