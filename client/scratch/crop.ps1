Add-Type -AssemblyName System.Drawing

$src = "E:\MIORA\client\public\miora_exact_popup_raw.png"
$dst = "E:\MIORA\client\public\miora_exact_popup.png"

$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height

$left = [int]($w * 0.118)
$top = [int]($h * 0.068)
$cropW = [int]($w * 0.784)
$cropH = [int]($h * 0.857)

$rect = New-Object System.Drawing.Rectangle($left, $top, $cropW, $cropH)
$bmp = New-Object System.Drawing.Bitmap($cropW, $cropH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), $rect, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$img.Dispose()

$bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Cropped image successfully!"
