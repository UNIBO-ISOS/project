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

    # def show
    #     @courier = Courier.find_by(username: params[:id])
    #     render json: @courier
    # end

    # POST /couriers
    def create
        @courier = Courier.new(courier_params)
        if @courier.save
            render json: @courier, status: 201
        else
            render json: { error: 'Unable to create Courier.' }, status: 400
        end
    end

    # PUT /couriers/:id
    def update
        @courier = Courier.find(params[:id])
        if @courier
            @courier.update(courier_params)
            render json: { message: 'Courier successfully updated.' }, status: 200
        else
            render json: { error: 'Unable to update Courier.' }, status: 400
        end
    end


    # DELETE /couriers/:id
    def destroy
        @courier = Courier.find(params[:id])
        if @courier
            @courier.destroy
            render json: { message: 'Courier successfully deleted.' }, status: 200
        else
            render json: { error: 'Unable to delete Courier.' }, status: 400
        end
    end

    private 
    
    def courier_params
        params.require(:courier).permit(:username, :password)
    end

end