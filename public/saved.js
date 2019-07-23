$(document).ready(
    () => {
        fetch("/saved-articles").then(res => res.json()).then(savedArticles => {
            console.log("Sending Saved Articles")

            if (!savedArticles.length) {
                $("#clear-button").hide()
            }

            savedArticles.slice(0, 5).forEach((article, index) => {
                $(".article-list").append(` 
   <div id=${index + 1} class="row">
    <div class="col s12 m12">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">${article.title}</span>
          <p>${article.description}</p>
          <a href=${article.link}>Read More</a>
        </div>
        <div class="card-action">
          <button class="btn" id=clear-${index + 1}>Clear Article</button>
          <button data-target=modal1 class="btn modal-trigger" id=${article._id}>Add Notes</button>
        </div>
     
    </div>
  </div>`
                )


                const clearBTN = document.getElementById(`clear-${index + 1}`); //[]
                clearBTN.addEventListener("click", () => {
                    console.log('heyyyyyyy got here')
                    fetch(`/clear-article/${article._id}`, {
                        method: "DELETE",

                    }).then(res => res.json()).then(removeArticle => {
                        console.log("Article Saved", removeArticle);
                        $(`#${index + 1}`).hide()
                    }).catch(err => {
                        console.log("error saving", err)
                    })
                });

                const modalTrigger = document.getElementById(`${article._id}`);
                modalTrigger.addEventListener("click", e => {
                    console.log('artileidddd', e.target.id)
                    $('#note-article-id').val(e.target.id);
                });

            });
        }).catch(err => {
            console.log("error", err)
        })

        const clearAll = document.getElementById('clear-button');
        clearAll.addEventListener('click', () => {
            fetch('/clear', { method: 'DELETE' }).then(res => res.json()).then(clearArticles => {
                console.log("Articles Cleared", clearArticles);
                window.location.reload();
            }).catch(err => {
                console.log("There Was An Error While Clearing", err)
            });
        });

        const userNotes = document.getElementById('submitBTN');
        userNotes.addEventListener("click", () => {
            const articleId = $('#note-article-id').val();
            const note = $('#noteBox').val();
            console.log('article Iddd', articleId);
            console.log('note submitted', note);

            fetch('/notes', {
                method: "POST",
                body: JSON.stringify({ articleId, body: note }),
                headers: {
                    'Content-Type': 'application/json' //necessary for POST and PUT request types
                }
            }).then(res => res.json()).then(createdNote => {
                console.log("Note Has Been Added", createdNote);
                $("#noteArea").append(`
                <div id=${createdNote._id} class="noteDiv">
                ${note}
                <button id=deleteNote-${createdNote._id}>X</button>
                </div>
                `)

                const noteDelete = document.getElementById(`deleteNote-${createdNote._id}`);
                noteDelete.addEventListener("click", () => {
                    fetch(`/note/remove/${createdNote._id}`, { method: "DELETE" }).then(res => res.json()).then(clearNote => {
                        console.log("note delted")
                        $(`#${createdNote._id}`).hide()
                    }).catch(err => {
                        console.log("could not delete note")
                    })
                })
            }).catch(err => {
                console.log("There was error adding this note")
            })
        })


    })