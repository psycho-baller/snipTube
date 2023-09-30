# Installing SnipTube as a Safari extension

<!-- [Source code](https://github.com/psycho-baller/) -->
I'm currently not willing to pay Apple $99/year to be able to distribute this extension through the App Store because [Safari sucks](https://www.reddit.com/media?url=https://preview.redd.it/safari-is-just-the-new-ie-v0-8h038hccu8x91.png?auto%3Dwebp%26s%3D7f63af0589883e983bfab5c8097503f78a6fcd77), but if you still want to use it there, you'll have to build it yourself, which takes about 5 minutes.

## Build it yourself

Prerequisite: Install Xcode

1. Download `SafariExtension.zip` from [the latest release](https://github.com/psycho-baller/sniptube/releases/latest) and unzip it

2. [Convert the extension to a MacOS app](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari) using:

```bash
xcrun safari-web-extension-converter /path/to/extension
```

3. Click run in the top of Xcode

![image](https://user-images.githubusercontent.com/12688112/123013186-bc6e5c80-d391-11eb-8ddc-5fec61cc2975.png)

4. [Configure Safari in macOS to Run Unsigned Extensions](https://developer.apple.com/documentation/safariservices/safari_web_extensions/running_your_safari_web_extension#3744467)

To develop without a certificate, tell Safari to load unsigned extensions using the Develop menu. To enable the Develop menu in Safari:
- Choose Safari > Preferences.
- Select the Advanced tab.
- Check the “Show Develop menu in menu bar” option.
- Then, choose Develop > Allow Unsigned Extensions. The Allow Unsigned Extensions setting is reset when you quit Safari; set it again the next time you launch Safari.

![image](https://user-images.githubusercontent.com/12688112/123013258-e0ca3900-d391-11eb-9ab2-4a6a932ec89a.png)

5. Now enable the extension
- Choose Safari > Preferences.
- Select the Extensions tab. This tab shows the localized description, display name, and version number for the selected Safari App Extension. It also provides more information about the permissions claimed by the extension.
- Find your new extension in the list on the left, and enable it by selecting the checkbox.
