import axios from "axios";
// 'https://hassala.qistar.rent/api/hassala/6aa43a59-19ac-4bcc-9313-3d5888cab0df'
export default axios.create({
  baseURL: "https://hassala.qistar.rent/api/",
});
