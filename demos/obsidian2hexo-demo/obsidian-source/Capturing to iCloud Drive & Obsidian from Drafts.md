---
Author: Mike Schmitz
Tags: drafts, icloud, setup
---

Obsidian is great at a lot of things, but quick capturing text is not one of them. I prefer to quick capture my text in Drafts and then send it to Obsidian using Drafts Actions. Unfortunately, if your vault is stored in iCloud Drive, this hasn't always been possible. But thanks to the Bookmarks feature added in Drafts version 28, you can now store text outside of the Drafts iOS sandbox.

_(BTW, if you want more info on Obsidian for iOS, check out [[Using Obsidian on iOS]].)_

## Setting Up the Bookmark

First, tap on the gear icon in the lower right of the Drafts screen to go to the Settings.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts1.jpg)

Next, scroll down to the _Storage_ section and tap _Bookmarks_.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts2.jpg)

Tap the plus icon in the upper right to add a bookmark.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts3.jpg)

Give your bookmark a name. I'll name this one "Inbox."

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts4.jpg)

I want to store these text files from Drafts in the _Inbox_ folder inside of my Obsidian vault. So let's tap on _Select Folder_, enable bookmark permissions, and then select the appropriate folder.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts5.jpg)

Make sure to select the correct folder and then tap _Done_, which will create a bookmark to that specific folder.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts6.jpg)

We're going to use this in the next step when we set up the _File Action_ inside of Drafts.

## Creating the Drafts Action

Now that we have the bookmark set up, we can create our Drafts action. The first line of the text in the Draft is the title, and everything else is the body. We can use those tokens when we set up our File Action here in just a second.

Tap the Drafts icon in the upper right to go to access the Drafts Actions.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts7.jpg)

Next, tap the plus button at the bottom and select _New Action_.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts8.jpg)

Name this action (once again, I'll call this _Inbox_), choose a new icon and color if you'd like, and then select _Steps_.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts9.jpg)

Tap the plus button to add a step and scroll down to select _File_.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts10.jpg)

There's a couple things we need to change in this action. By default, this is going to insert a timestamp for the file name and use a `.txt` file extension (which is not going to work with Obsidian). So let's change the extensions to `.md`and change the time token to `title`. This will take the first line of my Draft and insert that text as the title for the file.

Next, let's go to the template and remove the Draft content and put in the `body` content. So this will put all of the text below the first line into the contents of the text file that we're creating.

Here's what it should like so far:

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts11.jpg)

You may have noticed that there's a path field, but we're not going to worry about that because further down we can choose the _Destination_. Choose _Bookmark_, then tap the plus button and select the bookmark that you created in the Drafts settings.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts12.jpg)

Once you're finished, tap _Save & Exit_ to save the Drafts Action.

## Using the Action

Now we can trigger this action on the selected Draft. Just tap the button in the upper right and then tap the action that you want to use.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts13-1.jpg)

We'll get a confirmation when the action runs, and can see the file appear in our Files app.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts14.jpg)

And since our Obsidian vault is looking at that folder, the text is now viewable inside of our Obsidian app.

![](https://thesweetsetup.com/wp-content/uploads/2021/09/drafts15.jpg)

As you can see, the first line of the draft has been inserted as the title and everything below that has been inserted as the body text in the note.
