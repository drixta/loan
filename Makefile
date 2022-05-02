mac_install:
	brew install deno
	brew install lcov
windows_install:
	iwr https://deno.land/install.ps1 -useb | iex
compile:
	deno compile --allow-read entry.ts
test:
	deno test
coverage:
	deno test --coverage=cov_profile
coverage-html:
	deno test --coverage=cov_profile
	deno coverage cov_profile
	deno coverage cov_profile --lcov > cov_profile.lcov
	genhtml -o cov_profile/html cov_profile.lcov
	open cov_profile/html/index.html
