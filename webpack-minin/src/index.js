import * as $ from "jquery";
import Post from "@models/Post.js";
import json from "@/assets/json.json";
import xml from "@/assets/data.xml";
import csv from "@/assets/data.csv";
import webpackLogo from "@/assets/webpack-logo.png";
import "./styles/styles.css";

const post = new Post("webpack post title", webpackLogo);

console.log($);
$("pre").html(post.toString());
console.log(post.toString());
// console.log("post:", post.toString());
// console.log("json1", json);
// console.log("xml", xml);
// console.log("csv", csv);
