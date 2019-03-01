const File = require("vinyl");
const chai = require("chai");
const plugin = require("../lib");
const {
  expect
} = chai;


beforeEach(function () {
  this.stream = plugin();
  return this.file = new File({
    path: "file.peg"
  });
});

it("should compile file", function (done) {
  this.file.contents = new Buffer.from("start = ('a' / 'b')+");

  this.stream.on("data", function (file) {
    expect(file.path).be.equal("file.js");
    return done();
  });

  this.stream.write(this.file);
  return this.stream.end();
});


it("should throw error", function (done) {
  this.file.contents = new Buffer.from("start = > ('a' / 'b')+");

  this.stream.on("error", function (e) {
    expect(e.name).be.equal("SyntaxError");
    return done();
  });

  this.stream.write(this.file);
  return this.stream.end();
});