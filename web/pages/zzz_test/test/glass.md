
# glass

#### html

```
<div class="cards">
	<div class="card"></div>
	<div class="card card--glass">
		<div class="card__content">
			<h1 class="card__title">Transforming technology to serve the people</h1>
			<div class="card__logo">XYZ</div>
			<p class="card__url">someagency.xyz</p>
		</div>
	</div>
</div>
```

#### css

```
  * {
	border: 0;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
:root {
	--hue-primary: 223;
	--hue-secondary: 178;
	--primary500: hsl(var(--hue-primary), 90%, 50%);
	--primary600: hsl(var(--hue-primary), 90%, 60%);
	--primary700: hsl(var(--hue-primary), 90%, 70%);
	--secondary800: hsl(var(--hue-secondary), 90%, 80%);
	--dark-gray50: hsl(var(--hue-primary), 90%, 5%);
	--dark-gray100: hsl(var(--hue-primary), 90%, 10%);
	--white0: hsla(0, 0%, 100%, 0);
	--white50: hsla(0, 0%, 100%, 0.05);
	--white100: hsla(0, 0%, 100%, 0.1);
	--white200: hsla(0, 0%, 100%, 0.2);
	--white300: hsla(0, 0%, 100%, 0.3);
	--white400: hsla(0, 0%, 100%, 0.4);
	--white500: hsla(0, 0%, 100%, 0.5);
	--white: hsl(0, 0%, 100%);
	font-size: clamp(0.75rem, 0.65rem + 0.5vw, 1.25rem);
}
body {
	background: linear-gradient(90deg, var(--dark-gray100), var(--dark-gray50));
	color: hsl(0, 0%, 100%);
	font: 1em/1.5 "Work Sans", sans-serif;
	display: grid;
	place-items: center;
	height: 100vh;
}
.card {
	--blur: 12px;
	--width: 21.1em;
	--height: 12.8em;
	--move-by: 2em;
	background-image: linear-gradient(90deg, var(--primary600), var(--primary500));
	border-radius: 1em;
	box-shadow: 0 0.25em 0.375em hsla(0, 0%, 0%, 0.1);
	position: absolute;
	top: var(--move-by);
	left: calc(var(--move-by) * -1);
	width: var(--width);
	height: var(--height);
	transform: translate(-50%,-50%);

	[dir="rtl"] & {
		background-image: linear-gradient(-90deg, var(--primary600), var(--primary500));
		left: var(--move-by);
	}
	&--glass {
		backdrop-filter: blur(var(--blur));
		-webkit-backdrop-filter: blur(var(--blur));
		background-image: linear-gradient(90deg,var(--white200),var(--white50));
		color: transparent;
		top: calc(var(--move-by) * -1);
		left: var(--move-by);

		&:before,
		&:after {
			border-radius: inherit;
			content: "";
			display: block;
			position: absolute;
			inset: 0;
		}
		&:before {
			border: 1px solid var(--white);
			mask-image: linear-gradient(135deg,var(--white),var(--white0) 50%);
		}
		&:after {
			border: 1px solid var(--primary500);
			mask-image: linear-gradient(135deg,var(--white0) 50%,var(--white));
		}
		[dir="rtl"] & {
			background-image: linear-gradient(-90deg,var(--white200),var(--white50));
			left: calc(var(--move-by) * -1);

			&:before {
				mask-image: linear-gradient(-135deg,var(--white),var(--white0) 50%);
			}
			&:after {
				mask-image: linear-gradient(-135deg,var(--white0) 50%,var(--white));
			}
		}
	}
	&__content {
		background:
			linear-gradient(
				var(--white0) 3.125em,
				var(--primary700) 3.375em,
				var(--secondary800) 4.5em
			) 0 0 / calc(var(--width) - var(--move-by) * 2) 50%,
			linear-gradient(
				90deg,
				var(--secondary800) 13em,
				var(--primary700) calc(var(--width) - var(--move-by) * 2),
				var(--white0) 19.1em
			) 0 100% / 100% 50%,
			linear-gradient(
				90deg,
				var(--white500) 4em,
				var(--white200)
			) 0 0 / 100% 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.25em 1.5em;
		position: relative;
		height: 100%;
		z-index: 1;

		[dir="rtl"] & {
			background:
				linear-gradient(
					var(--white0) 3.125em,
					var(--primary700) 3.375em,
					var(--secondary800) 4.5em
				) 100% 0 / calc(var(--width) - var(--move-by) * 2) 50%,
				linear-gradient(
					-90deg,
					var(--secondary800) 13em,
					var(--primary700) calc(var(--width) - var(--move-by) * 2),
					var(--white0) 19.1em
				) 100% 100% / 100% 50%,
				linear-gradient(
					-90deg,
					var(--white500) 4em,
					var(--white200)
				) 100% 0 / 100% 100%;
		}
		&,
		[dir="rtl"] & {
			-webkit-background-clip: text;
			background-clip: text;
			background-repeat: no-repeat;
		}
	}
	&__logo,
	&__title {
		font: {
			size: 1.5em;
			weight: 700;
		};
		line-height: 1.17;
	}
	&__logo {
		text-align: end;
		width: 25%;
	}
	&__title {
		font-family: Caladea, serif;
		width: 75%;
	}
	&__url {
		font-size: 0.75em;
		align-self: flex-end;
		margin-inline-start: auto;
	}
}
.cards {
	position: relative;
}
```

#### font
```
https://fonts.googleapis.com/css2?family=Caladea:ital,wght@0,400;0,700;1,400;1,700&amp;family=Work+Sans:ital,wght@0,100..900;1,100..900&amp;display=swap
```

#### css
```
* {
	border: 0;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
:root {
	--hue-primary: 223;
	--hue-secondary: 178;
	--primary500: hsl(var(--hue-primary), 90%, 50%);
	--primary600: hsl(var(--hue-primary), 90%, 60%);
	--primary700: hsl(var(--hue-primary), 90%, 70%);
	--secondary800: hsl(var(--hue-secondary), 90%, 80%);
	--dark-gray50: hsl(var(--hue-primary), 90%, 5%);
	--dark-gray100: hsl(var(--hue-primary), 90%, 10%);
	--white0: hsla(0, 0%, 100%, 0);
	--white50: hsla(0, 0%, 100%, 0.05);
	--white100: hsla(0, 0%, 100%, 0.1);
	--white200: hsla(0, 0%, 100%, 0.2);
	--white300: hsla(0, 0%, 100%, 0.3);
	--white400: hsla(0, 0%, 100%, 0.4);
	--white500: hsla(0, 0%, 100%, 0.5);
	--white: hsl(0, 0%, 100%);
	font-size: clamp(0.75rem, 0.65rem + 0.5vw, 1.25rem);
}
body {
	background: linear-gradient(90deg, var(--dark-gray100), var(--dark-gray50));
	color: hsl(0, 0%, 100%);
	font: 1em/1.5 "Work Sans", sans-serif;
	display: grid;
	place-items: center;
	height: 100vh;
}
.card {
	--blur: 12px;
	--width: 21.1em;
	--height: 12.8em;
	--move-by: 2em;
	background-image: linear-gradient(90deg, var(--primary600), var(--primary500));
	border-radius: 1em;
	box-shadow: 0 0.25em 0.375em hsla(0, 0%, 0%, 0.1);
	position: absolute;
	top: var(--move-by);
	left: calc(var(--move-by) * -1);
	width: var(--width);
	height: var(--height);
	transform: translate(-50%, -50%);

	[dir="rtl"] & {
		background-image: linear-gradient(
			-90deg,
			var(--primary600),
			var(--primary500)
		);
		left: var(--move-by);
	}
	&--glass {
		backdrop-filter: blur(var(--blur));
		-webkit-backdrop-filter: blur(var(--blur));
		background-image: linear-gradient(90deg, var(--white200), var(--white50));
		color: transparent;
		top: calc(var(--move-by) * -1);
		left: var(--move-by);

		&:before,
		&:after {
			border-radius: inherit;
			content: "";
			display: block;
			position: absolute;
			inset: 0;
		}
		&:before {
			border: 1px solid var(--white);
			mask-image: linear-gradient(135deg, var(--white), var(--white0) 50%);
		}
		&:after {
			border: 1px solid var(--primary500);
			mask-image: linear-gradient(135deg, var(--white0) 50%, var(--white));
		}
		[dir="rtl"] & {
			background-image: linear-gradient(-90deg, var(--white200), var(--white50));
			left: calc(var(--move-by) * -1);

			&:before {
				mask-image: linear-gradient(-135deg, var(--white), var(--white0) 50%);
			}
			&:after {
				mask-image: linear-gradient(-135deg, var(--white0) 50%, var(--white));
			}
		}
	}
	&__content {
		background: linear-gradient(
					var(--white0) 3.125em,
					var(--primary700) 3.375em,
					var(--secondary800) 4.5em
				)
				0 0 / calc(var(--width) - var(--move-by) * 2) 50%,
			linear-gradient(
					90deg,
					var(--secondary800) 13em,
					var(--primary700) calc(var(--width) - var(--move-by) * 2),
					var(--white0) 19.1em
				)
				0 100% / 100% 50%,
			linear-gradient(90deg, var(--white500) 4em, var(--white200)) 0 0 / 100% 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.25em 1.5em;
		position: relative;
		height: 100%;
		z-index: 1;

		[dir="rtl"] & {
			background: linear-gradient(
						var(--white0) 3.125em,
						var(--primary700) 3.375em,
						var(--secondary800) 4.5em
					)
					100% 0 / calc(var(--width) - var(--move-by) * 2) 50%,
				linear-gradient(
						-90deg,
						var(--secondary800) 13em,
						var(--primary700) calc(var(--width) - var(--move-by) * 2),
						var(--white0) 19.1em
					)
					100% 100% / 100% 50%,
				linear-gradient(-90deg, var(--white500) 4em, var(--white200)) 100% 0 / 100%
					100%;
		}
		&,
		[dir="rtl"] & {
			-webkit-background-clip: text;
			background-clip: text;
			background-repeat: no-repeat;
		}
	}
	&__logo,
	&__title {
		font: {
			size: 1.5em;
			weight: 700;
		}
		line-height: 1.17;
	}
	&__logo {
		text-align: end;
		width: 25%;
	}
	&__title {
		font-family: Caladea, serif;
		width: 75%;
	}
	&__url {
		font-size: 0.75em;
		align-self: flex-end;
		margin-inline-start: auto;
	}
}
.cards {
	position: relative;
}
```
