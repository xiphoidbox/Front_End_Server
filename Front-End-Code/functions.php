<?php

function db_connect($database)
{
        $username = "webuser"; 
        $password = "cKtBg.jvfd2ntPQ3"; 
        $hostname = "localhost";
        $dblink = new mysqli($hostname, $username, $password, $database);

        if ($dblink->connect_error) {
                die("Connection failed: " . $dblink->connect_error);
        }

        return $dblink;
}

function redirect($uri)
{ ?>
        <script type="text/javascript">
                document.location.href = "<?php echo $uri; ?>";
        </script>
<?php die();
}
?>
