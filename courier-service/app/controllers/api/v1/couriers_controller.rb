class Api::V1::CouriersController < ApplicationController
    
    # GET /couriers
    def index
        @couriers = Courier.all
        render json: @couriers
    end

    # GET /couriers/:id
    def show
        @courier = Courier.find(params[:id])
        render json: @courier
    end

    # POST /couriers/:id/availability
    def availability
        @price_proposal = rand(10...42) 

        render json: { }, stauts: 200

        # todo: INVIARE UN HTTP POST DOPO IL RENDER, 
        # todo: CONTENENTE I DATI PER SBLOCCARE IL TOKEN
    end

    def confirm
        render status: 200
    end
end
