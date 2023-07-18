<h1>Hi</h1>
<p>BatchDriven User "{{ $user->name }}" is inviting you.</p>
<p>Please verify your email.</p>
<a href="{{config('app.url')}}/signup/{{$token}}">
  {{config('app.url')}}/signup/{{ $token }}
</a>
