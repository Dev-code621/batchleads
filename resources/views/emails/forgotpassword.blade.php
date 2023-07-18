<h1>Hi, {{ $user->name }}</h1>
<p>Please reset your password.</p>
<a href="{{config('app.url')}}/reset-password/{{$token}}">
{{config('app.url')}}/reset-password/{{ $token }}
</a>
