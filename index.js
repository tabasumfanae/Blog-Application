import express from "express"
import bodyParser from "body-parser"
import path from "path"
import multer from "multer"
import methodOverride from "method-override"
import { fsync } from "fs"

const app = express()
const port = 3009

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})
app.use(methodOverride("_method"))

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1 MB limit
})

const blogPosts = [
  // blogPosts array remains unchanged
]

let posts = [...blogPosts]

app.get("/", (req, res) => {
  res.render("index", { posts })
})

app.get("/posts", (req, res) => {
  res.render("new-post")
})

app.post("/posts", upload.single("image"), (req, res) => {
  // Corrected line
  const { title, content } = req.body
  const image = req.file ? `/images/${req.file.filename}` : null
  const id = posts.length + 1

  const newPost = { id, title, content, image }
  posts.push(newPost)

  res.redirect("/")
})

app.get("/edit-post/:id", (req, res, next) => {
  const itemId = req.params.id
  const selectedItem = posts.find((item) => item.id == itemId)
  if (!selectedItem) {
    // Handle the case where no item is found with the given id
    return res.status(404).send("Item not found")
  }
  res.render("./edit-post.ejs", { data: selectedItem })
  //console.log("selecten item in edit " + selectedItem.images);
})

app.put("/edit-post/:id", upload.single("image"), (req, res) => {
  let title = req.body.title
  let body = req.body.body
  let id = req.params.id
  const selectedItem = posts.find((item) => item.id == id)

  const imagePath = req.file ? req.file.path : selectedItem.image // Added fallback for image

  // Store the original item by creating a deep copy of the selectedItem
  const originalItem = JSON.parse(JSON.stringify(selectedItem))

  selectedItem.title = title // Corrected the field names
  selectedItem.content = body

  if (req.file) {
    // If a new image is uploaded, update the image path
    selectedItem.image = imagePath.replace("public/", "").replace(/\\/g, "/")
  }

  if (
    selectedItem.title !== originalItem.title ||
    selectedItem.content !== originalItem.content ||
    (req.file && selectedItem.image !== originalItem.image) // Corrected the field names
  ) {
    res.redirect("/?Emessage=true&&text=Post Updated Successfully")
  } else {
    res.redirect(`/`)
  }
})

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id)
  posts = posts.filter((post) => post.id !== postId)

  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Blog application listening at http://localhost:${port}`)
})
