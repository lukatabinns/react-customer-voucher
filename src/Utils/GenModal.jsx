import {Button, Text, Modal} from "@bigcommerce/big-design";

const GenModal = ({handleModal, isOpen, deleteAllowance, id, name}) => {

    return (

        <Modal
            actions={[
                {
                    text: 'Cancel',
                    variant: 'subtle',
                    onClick: () => handleModal(),
                },
                { text: 'Yes', onClick: () => deleteAllowance(id, name) },
            ]}
            closeOnClickOutside={false}
            closeOnEscKey={true}
            header="Delete Voucher Coupon"
            isOpen={isOpen}
            onClose={() => handleModal()}
        >
            <Text> Deleting voucher code <strong>"{name}"</strong>. Are you sure? </Text>
        </Modal>
    );
}

export default GenModal;
