### How to Execute the Program

The project includes an executable at `./entry`

To run:

```
./entry <action.json filepath> <tasks.json filepath>
```

The test files are included in this repo under `/samples`, you can execute for
example:

```
./entry samples/actions.json samples/tasks.json
```

To run the Makefile commands, you will need to install `Deno` to your system
https://deno.land/#installation

To install on Mac you can first try to install dependencies

`make Makefile mac_install`

Then to run test

`make Makefile test`

Or to view test coverage

`make Makefile coverage-html`
