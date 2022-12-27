# devtools-boilerplate

> This is an example repository that allows you to create devtools extensions


# How to use

1. Clone the project.

```shell
git clone https://github.com/incepter/devtools-boilerplate
cd devtools-boilerplate
```

2. Install dependencies:

```shell
pnpm i
```

3. Edit env files: Access `.env` files and change them according to your needs:

```text
NODE_ENV=development
EXTENSION_AUTHOR=author
EXTENSION_LIB_NAME=my-lib
EXTENSION_LIB_DISPLAY_NAME=My Lib
EXTENSION_STORAGE_KEY=__some_key__
EXTENSION_LIB_DESCRIPTION=Description for my devtools extension
```

This project uses vite to bundle and manage the project.
The environment passed under `process.env` are `NODE_ENV` and any variable
starting with `EXTENSION_`. So you could add custom variables that would help
you when developing your extension.

4. Start in development mode:

To allow using the devtools in development mode too, you can start it
using:

```shell
pnpm dev
```


5. Build in production mode:

```shell
pnpm build
```

6. Then you can install your extensions as [unpacked to chrome](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)
and just choose the build folder

7. Close the devtools if open, then refresh the tab and reopen it again


By [@incepter](https://twitter.com/incepterr), with 💜
