<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>
</head>
<body>
<!-- <form action="/subscribe_process" method="POST"> -->
<form action="/get_stripe_token" method="POST">
    {{ csrf_field() }}
    <script
            src="https://checkout.stripe.com/checkout.js" class="stripe-button"
            data-key="{{ config('services.stripe.key') }}"
            data-amount="1999"
            data-name="Stripe Demo"
            data-description="Monthly subscription"
            data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
            data-locale="auto"
            data-currency="usd">
    </script>
</form>

<hr />

</body>
</html>
