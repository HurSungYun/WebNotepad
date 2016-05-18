# WebNotepad

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

WebNotepad is a kind of notepad for web users. 

It is developed with Ruby on Rails and AngularJS.

Used AngularJS, Ruby on Rails, Bower, Bootstrap, and Font Awesome.

If you want to execute the app, use these commands.

```sh
$ git clone https://github.com/HurSungYun/WebNotepad
$ cd WebNotepad
$ rails server -p [port]
```

This app is designed for single user at once. Therefore, Concurrency haven't considered.

Documentation and API are in Wiki. (Testing Scenarios and comments are also included)

# Feature

## Note

You can create, edit, delete Note with subject and content. The content of note and form is shown on the right view.

Length of subject should be 1~45. Otherwise its log tells you an error.

There is two mode. One is Create Mode and the other is Edit mode.

In Edit mode, you can edit your note that already created.

If you click "New Memo" button, it turns into Create Mode.

In Create Mode, you can create new note.

## Label

You can add label to categorize your notes. You also can tag notes to some tags. It means that you can tag several label for one note.

Also, label can have several notes.

If you click yellow label button on the middle view, editing or deleting label can be possible.

Length of name should be 1~12. Otherwise its log tells you an error.

## Other features

### Del List

If you check some notes and click red "Del" button, lists of notes would be deleted.

### Search

If you type some words in serach input, only matching notes would be shown. It searches both subject and content.


# Enjoy this app!

and if you have some question, hit me. ethan0311@gmail.com
