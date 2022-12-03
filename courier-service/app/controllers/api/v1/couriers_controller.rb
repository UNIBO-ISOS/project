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

        #render json: { }, stauts: 200
        @priceKey = "price" << params[:id]
        @proposal_with_bk = {
            messageName: "Message_rcvPrice",
            businessKey: params[:bk],
            localCorrelationKeys: {
                InputCourier: {
                    value: params[:id],
                    type: "String"
                }
            },
            processVariablesLocal: {
                price: {
                    value: @price_proposal,
                    type: "Double"
                }
            }
        }

        #puts @proposal_with_bk
        send_data_to_unlock_token(@proposal_with_bk)

        render json: {params: params},  status: 200

    end

    def confirm
        render status: 200
    end

    private 

    def client_ip
        request.ip
    end

    def send_data_to_unlock_token(message)
        puts message
        #render json: @message, status: 200

        response = HTTParty.post(
            "http://camunda:8080/engine-rest/message",
            body: message.to_json,
            headers: {
                "Content-Type" => "application/json"
            }
        )

        puts response
    end
end
