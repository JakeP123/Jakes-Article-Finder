$(document).ready(


    () => {


        $(".article-list").append(`
                <div class="row col s12 m12 noArticle">
                    <h2>No Article Yet, Hit The Scrape Button For a List!</h2>
                </div>
    `)




        const scrapeBtn = document.getElementById('scrape-button');
        scrapeBtn.addEventListener('click', () => {
            fetch('/scrape').then(res => res.json()).then(articles => {
                console.log("Fetch Successful", articles);

                if (articles.length) {
                    $(".noArticle").hide()
                    $("#scrape-button").hide()
                    $("#clear-button").show()

                    // populate DOM with articles list

                    articles.slice(0, 5).forEach((article, index) => {
                        $(".article-list").append(` 
                       <div id=${index + 1} class="row">
                        <div class="col s12 m12">
                          <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                              <span class="card-title" style="font-color: black">${article.title}</span>
                              <p>${article.description}</p>
                              <a href=${article.link} >Read More</a>
                            </div>
                            <div class="card-action">
                              <button id=save-${index + 1}>Save Article</button>
                            </div>
                          </div>
                        </div>
                      </div>`
                        )


                        const saveBTN = document.getElementById(`save-${index + 1}`); //[]
                        saveBTN.addEventListener("click", () => {
                            console.log('heyyyyyyy got here')
                            fetch("/save", {
                                method: "POST",
                                body: JSON.stringify(article),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(res => res.json()).then(saveArticle => {
                                console.log("Article Saved", saveArticle);
                                $(`#${index + 1}`).hide()
                            }).catch(err => {
                                console.log("error saving", err)
                            })
                        });

                    });
                }

            }).catch(err => {
                console.log("Houston, We Have An Error!", err)
            });
        });

        const clearBTN = document.getElementById('clear-button');
        clearBTN.addEventListener('click', () => {
            fetch('/clear', { method: 'DELETE' }).then(res => res.json()).then(clearArticles => {
                console.log("Articles Cleared", clearArticles)

                $("#scrape-button").show()
                $("#clear-button").hide()
                $(".noArticle").show()

            }).catch(err => {
                console.log("There Was An Error While Clearing", err)
            });

        });

        clearBTN.click();
        //$("#clear-button").trigger('click');

    }
)