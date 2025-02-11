<div align="center">

# 1 - Introduction to Python 🐍

</div>

&nbsp;

---

Python is a high-level, interpreted programming language that is easy to learn and use. It is a popular language for web development, data analysis, artificial intelligence, and scientific computing.

## Addition Operation
When you write 1+1 and press F9(exectution) the answer is displayed in the right side console

Python first reads the code , evalutes the code and finally output is
displayed this loop is called Read-Evaluate-Print-Loop or simply REPL

```python{data-theme-light}{data-theme-dark}
1+1
```

## Python ```print()``` function

Python's ```print()``` function takes some text as input and displays that on the screen

```python{data-theme-light}{data-theme-dark}
print("Hello, World")
```

## Python Script Files

The code in the file is called is a Script , and files
containing Python Scripts are called script files and we should save Python file
with .py extension

### example of syntax error

```python{data-theme-light}{data-theme-dark}
print("Hello , World)
```

_EOL means End Of Line error as we missed to end String literal with quotaion marks_

&nbsp;

### example of runtime error

```python{data-theme-light}{data-theme-dark}
print(Hello, World)
```

_Runtime error as we missed to end String literal with quotaion marks_


## Python Variables

In Python, variables are names that can be assigned a value and used
to reference that value throughout your code

Variable names are case-sensitive

Variables can contain uppercase, lowercase letters(A-Z , a-z) and digits(0-9) and
an under score, but cannot start with Zero

```python{data-theme-light}{data-theme-dark}
word = "Hello"
print(word)
```

_Values are assigned to a variable using a special symbol = called the
assignment operator. An operator is a symbol, like = or +, that
performs some operation on one or more values._

## Python Variable Naming Conventions

The most common way to write a comment is to begin a new line in
your code with the # character. When your code is run, any lines starting
with # are ignored. Comments that start on a new line are calledblock comments.

### Python Variable Naming Conventions

In many programming languages, it is common to write variable
names in camelCase like numStudents and listOfNames. The first letter
of every word, except the first, is capitalized, and all other letters are
lowercase. The juxtaposition of lower-case and upper-case letters
look like humps on a camel

In Python, however, it is more common to write variable names in
snake case like num_students and list_of_names. Every letter is lower￾case,
and each word is separated by an underscoreIn Python, however, it is more common
to write variable names in snake case like num_students and list_of_names.
Every letter is lower￾case, and each word is separated by an underscore


## How to Write a Comment

The most common way to write a comment is to begin a new line in your code with
the # character. When your code is run, any lines start￾ing with # are ignored.
Comments that start on a new line are called block comments.

You can also write in-line comments, which are comments that ap￾pear on the same
line as some code. Just put a # at the end of the line
of code, followed by the text in your comment.

```python{data-theme-light}{data-theme-dark}
sum1 = 2+3
print(sum1)   # this prints the sum of two numbers
```

&nbsp;

---

Authored by : _[@ManideepBangaru](https://github.com/manideepbangaru)_
