const express = require("express");
const app = express();

const { usePermissionManger } = require(".");

app.use(usePermissionManger());