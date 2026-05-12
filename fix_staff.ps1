$path = "src/pages/erp/StaffPage.jsx"
$c = Get-Content $path
$c[0..253] + $c[255..($c.Length-1)] | Set-Content $path
