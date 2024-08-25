import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"


const app = express();
const port = 4002;


app.use(cors());
app.use(bodyParser.json())

interface PostItem {
    id: string;
    title: string;
    comments: any[];
  }

const posts: PostItem[] = []
app.get('/posts', (req,res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if(type === "POST_CREATED") {
        const {id, title} = data;

        posts.push({id, title, comments: []})

    }

    if(type === "COMMENT_CREATED") {
        const {commentId, comments, idPost, status} = data;
        console.log(posts)
        const currentPost = posts.filter(post => post.id === idPost)

        currentPost[0].comments.push({id:commentId, content:comments, status})
        console.log(posts)
    }
    
    res.send({status: "Ok"});
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  