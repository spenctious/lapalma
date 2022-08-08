#---------------------------------------------------------------------------
#
# Script to extract the data from the LaPalmaData database into a JSON file
#
# Author: Robert Anstey
# Data 08/08/2022
#
#---------------------------------------------------------------------------

# Script parameters
$Instance = 'localhost\SQLEXPRESS'
$Database = 'LaPalmaForWalkers'
$StoredProcedure = 'dbo.lapalmadata_to_json'
$OutputParameter = '@jsonOutput'
$ParameterSize = 300000 # If too small no data is returned
$OutputJsonFile = '.\lapalma-data.json'

# Treat all errors as exceptions
$ErrorActionPreference = 'Stop'

try
{
	# Connect to the database	
	$SqlConn = New-Object System.Data.SqlClient.SqlConnection("Server = $Instance; Database = $Database; Integrated Security = True;")

	# Open the connection
	$SqlConn.Open()

	# Define the stored procedure to execute
	$Cmd = $SqlConn.CreateCommand()
	$Cmd.CommandType = [System.Data.CommandType]::StoredProcedure
	$Cmd.CommandText = $StoredProcedure

	# Define to output parameter
	$OutParameter = New-Object System.Data.SqlClient.SqlParameter
	$OutParameter.ParameterName = $OutputParameter
	$OutParameter.Direction = [System.Data.ParameterDirection]'Output'
	$OutParameter.DbType = [System.Data.DbType]'String'
	$OutParameter.Size = $ParameterSize
	$Cmd.Parameters.Add($OutParameter) | Out-Null

	# Execute the procedure
	$Result = $Cmd.ExecuteNonQuery()
	$LaPalmaData = $Cmd.Parameters[$OutputParameter]
	
	# Check there is actually data returned before overwriting the output JSON file
	if ($LaPalmaData.Value -eq $null)
	{
		throw 'No data returned!'
	}
	
	# Save the results to file
	$LaPalmaData.Value | Out-File -Encoding "UTF8" -Filepath $OutputJsonFile
}
catch
{
	# Report the error
	$err = $_.Exception
	Write-Output $err.Message
	while( $err.InnerException ) 
	{
		$err = $err.InnerException
		Write-Output $err.Message
	}
}
finally
{
	# Close the connection
	$SqlConn.Close()	
}

