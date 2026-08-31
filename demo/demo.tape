# Demo of convert-md-to-bbcode, rendered with VHS (https://github.com/charmbracelet/vhs)
# Regenerate with: vhs demo/demo.tape

Output demo/demo.gif

Set Shell "bash"
Set FontSize 16
Set Width 920
Set Height 520
Set Padding 16
Set TypingSpeed 35ms

Hide
Type "cd tmp && printf '# RSI Divergence\n\n## The idea\n\nSpots **hidden divergences** between price and RSI.\n\n- works on *any* timeframe\n- marks signals with `labels`\n\nRead the [Pine docs](https://www.tradingview.com/pine-script-docs/) first.\n' > indicator.md && alias convert-md-to-bbcode='node ../bin/cli.js' && clear"
Enter
Show

Type "cat indicator.md"
Enter
Sleep 2.5s

Type "convert-md-to-bbcode indicator.md --pinecoders"
Enter
Sleep 5s

Hide
Type "rm -f indicator.md"
Enter
Show
