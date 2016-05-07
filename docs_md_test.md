{{#template name='docs_md_test'}}
# Markdown examples

# H1
## H2
### H3
#### H4

# Emphasis

Emphasis, aka italics, with *asterisks*.

Strong, aka bold, with double **asterisks**

Strong with emphasis, ***triple asterisks***

# Code

inline `code` with backticks

    indented code
    for blocks

```
triple backtick code block
```

#Lists

Github style with leading space-dash

 - first UL item
 - second UL item

and space-number

 1. first point
 2. second point

(In this example, leading and trailing spaces are shown with with dots: ⋅)

1. First ordered list item
2. Another item
   * Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

After some intervening text we can do unordered lists again.

* Unordered list can use asterisks
- Or minuses
+ Or pluses

# Links

There are two ways to create links.

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

# Images

Relative image src ![from /docs/images/md.jpeg](/docs/images/md.jpeg)

Here's our logo (hover to see the title text):

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style: 
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"


{{/template}}
