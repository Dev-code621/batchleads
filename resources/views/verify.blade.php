<p>{{ $message }}</p>
<?php
    if ($success) {
?>
<p>Redirecting to dashboard...</p>
<script>
    setTimeout(function () {
      location.href = '<?php echo $url; ?>';
    }, 5000);
</script>
<?php
    } else if($email) {
?>
<a href='<?php echo $url; ?>/verify/resend/{{ $email }}'>Resend verification link</a>
<?php
    }
?>
