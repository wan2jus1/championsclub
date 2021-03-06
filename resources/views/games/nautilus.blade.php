@extends('games.types.game')

@section('css')
    <link href="{{asset('public/css/nautilus.css')}}" rel=stylesheet type=text/css>
@endsection

@section('help')

@component('games.parts.help')
    @slot('helpValues')
        <div data-symbols="12 11" class="help__prize_container"></div>
        <div data-symbols="12 11" data-joker class="help__prize_container"></div>
        <div data-symbols="2 6" class="help__prize_container"></div>
        <div data-symbols="2 6" data-joker class="help__prize_container"></div>
        <div data-symbols="1 5 10" class="help__prize_container"></div>
        <div data-symbols="1 5 10" data-joker class="help__prize_container"></div>
        <div data-symbols="8" class="help__prize_container"></div>
        <div data-symbols="3" class="help__prize_container"></div>
        <div data-symbols="7 9" class="help__prize_container"></div>
        <div data-symbols="7 9" data-joker class="help__prize_container"></div>
        <div data-symbols="4" class="help__prize_container"></div>
        <div data-symbols="4" data-joker class="help__prize_container"></div>
        <div data-symbols="0" class="help__prize_container"></div>
        <div data-symbols="0" data-joker class="help__prize_container"></div>

    @endslot
@endcomponent

@endsection   
@section('js')
    @parent
    <script src="{{asset('public/js/nautilus_settings.js')}}"></script>
    <script src="{{asset('public/js/game.js')}}"></script>
    <script>
        var game = new divSlot.Game('Nautilus');
    </script>
@endsection
