# SnipTube - Elevate Your YouTube Experience

<picture>
<!--   <source media="(prefers-color-scheme: dark)" srcset="assets/SnipTube logo-dark.svg"> -->
  <source media="(prefers-color-scheme: light)" srcset="assets/SnipTube logo.svg">
  <img width="100%" alt="Shows a black logo in light color mode and a white one in dark color mode." src="assets/SnipTube logo-dark.svg">
</picture>

Hours spent on Project:
<a href="https://wakatime.com/badge/user/33addb7e-f5e6-470b-a55b-0a8babc62ebb/project/7432176a-d08e-48bd-96fb-6cba5c9f4fa2"><img src="https://wakatime.com/badge/user/33addb7e-f5e6-470b-a55b-0a8babc62ebb/project/7432176a-d08e-48bd-96fb-6cba5c9f4fa2.svg" alt="wakatime"></a>

## What is SnipTube?

Are you tired of trying to remember the best moments in those lengthy YouTube videos? Look no further! SnipTube empowers you to effortlessly highlight, tag, and annotate the most captivating parts of your favorite YouTube videos (we call these snips). Plus, with the magic of AI, it generates summaries for each snip, making it a breeze to revisit. Let's take a closer look at what SnipTube has to offer:

### Features

🎯 **Intelligent Summarization**:
SnipTube harnesses the power of advanced AI algorithms to automatically generate concise summaries for each snip. Say goodbye to the hassle of rewatching entire videos to find that one crucial detail - SnipTube will have it neatly summarized for you!

🗂️ **Organize and Tag**:
Keep your snips neatly organized and easily searchable by **assigning custom tags and annotations** to each snip. Whether it's for educational purposes, research, or personal entertainment, SnipTube makes it effortless to navigate through your collection and recall important context for each snip.

💎 **A Collection of Your YouTube Gems**:
Build an exquisite collection of your most cherished YouTube moments that you can revisit anytime, all in one place. No more digging through lengthy videos to find that one valuable piece of information!

📤 **Export with Ease**:
Need to take your snips on the go? No problem! With a simple click of a button, you can easily export individual snips or the entire collection in Markdown format. Seamlessly import them into your favorite note-taking app and continue your learning journey.

🌐 **Perfect for All Users**:
SnipTube caters to everyone, whether you're a student looking to ace your exams, a researcher seeking cutting-edge insights, or simply a casual YouTube enthusiast. Say goodbye to wasting time searching for that elusive moment in a video.

🚀 **Constantly Evolving**:
I am committed to providing you with the best experience possible, which is why I am continually updating and enhancing SnipTube. I strive to make it the ultimate YouTube companion for all users, and I am always open to feedback and suggestions.

**Be an Early Adopter and Make a Difference!**

As one of the first to experience the game-changing SnipTube extension, your feedback and support are invaluable in shaping its future. Whether you encounter any issues, have ideas for improvement, or simply want to share your thoughts, I'm all ears!

Reach out to us through:

- 🐞 [Creating a GitHub issue](https://github.com/psycho-baller/snipTube/issues/new/choose)
- 📧 [Sending me an email](https://mail.google.com/mail/u/0/?fs=1&to=rami.rami@ucalgary.ca&su=SnipTube%20-%20&body=Hey%20Rami,%20....&tf=cm)
- 📞 [Scheduling an online call with me](https://cal.com/rami-maalouf/any)

Your input is my inspiration, and together, we'll make SnipTube even better!

### Get Involved - Support & Contribute! 💙

Creating and maintaining SnipTube has been a labor of love, and I'm thrilled to offer it as a free tool for everyone to enjoy. If you find SnipTube valuable and wish to support its development, consider making a donation. Your contribution will directly contribute to making SnipTube even better and more feature-rich. Additionally, show your appreciation by starring the open-source repository on GitHub and feel free to contribute your ideas and skills to enhance SnipTube's functionality.

Don't miss the chance to revolutionize your YouTube experience. Download SnipTube now and take control of your favorite moments like never before!

## Contributing

### Prerequisites

- run `pnpm i` in the root folder to install all the node dependencies.
- create a virtual environment with `python3 -m venv venv` and activate it with `source venv/bin/activate` then run `pip install -r requirements.txt` to install all the python dependencies.
- run `cp .env.example .env` to create a `.env` file and fill in the required environment variables.

### Development

To run the browser extension, run `pnpm dev:plasmo` in the root folder, then you will find the extension in the `build/chrome-mv3-dev` folder. You can then load the extension in chrome by going to `chrome://extensions` and clicking on `Load unpacked` and selecting that folder.

To also run the backend alongside the extension, run `pnpm dev` in the root folder, this will start the Next.js and the FastAPI server.

## License

[MIT](https://choosealicense.com/licenses/mit/)

SnipTube is not affiliated with YouTube or its parent company, Google Inc.
