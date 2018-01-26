@extends('games.types.gameWithBorder')

@section('css')
    <link href="{{asset('public/css/bookofwins.css')}}" rel=stylesheet type=text/css>
@endsection

@section('gamble')
    @include('games.parts.gamble')
@endsection

@section('js')
    @parent
    <script src="{{asset('public/js/bookofwins_settings.js')}}"></script>
    <script src="{{asset('public/js/game.js')}}"></script>
    <script>
        var game = new divSlot.Game('BookOfWins');
    </script>
@endsection
